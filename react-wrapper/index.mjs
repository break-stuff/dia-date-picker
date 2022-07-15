import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

import { camelize, createEventName, has, RESERVED_WORDS } from './utils.mjs';

// eslint-disable-next-line no-undef
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

export default function reactWrapper({
  exclude = [],
  attributeMapping = {},
  outdir = 'legacy',
  typescript,
} = {}) {
  return {
    name: 'react-wrapper',
    packageLinkPhase({ customElementsManifest }) {
      if (!fs.existsSync(outdir)) {
        fs.mkdirSync(outdir);
      }

      const useTypeScript = shouldUseTypeScript(typescript);
      const components = [];
      customElementsManifest.modules.forEach(mod => {
        mod.declarations.forEach(dec => {
          if (
            !exclude.includes(dec.name) &&
            (dec.customElement || dec.tagName)
          ) {
            components.push(dec);
          }
        });
      });

      components.forEach(component => {
        const events = getEventNames(component);
        const { booleanAttributes, attributes } = setAttributes(
          component,
          attributeMapping
        );
        const result = getJsxFileContents(
          component,
          events,
          booleanAttributes,
          attributes,
          outdir
        );

        saveFile(outdir, `${component.name}.jsx`, result);

        if (useTypeScript) {
          const result = getJsxFileContents(
            component,
            events,
            booleanAttributes,
            attributes,
            outdir,
            true
          );

          saveFile(outdir, `${component.name}.tsx`, result);
        }
      });

      saveFile(outdir, 'index.js', getManifestContent(components));

      if (useTypeScript) {
        saveFile(outdir, 'index.d.ts', getManifestContent(components));
        saveFile(outdir, 'index.ts', getManifestContent(components));
      }
    },
  };
}

function shouldUseTypeScript(typescript) {
  return typescript === false
    ? false
    : typescript === true || packageJson.types !== undefined;
}

function getFields(component) {
  return component?.members?.filter(
    member =>
      member.kind === 'field' &&
      !member.static &&
      member.privacy !== 'private' &&
      member.privacy !== 'protected' &&
      !member.attribute &&
      member.type
  );
}

function getEventNames(component) {
  return component?.events?.map(event => {
    return {
      name: event.name,
      reactName: createEventName(event),
    };
  });
}

function setAttributes(component, attributeMapping) {
  const result = {
    attributes: [],
    booleanAttributes: [],
  };
  component?.attributes
    ?.filter(attr => attr.fieldName)
    ?.forEach(attr => {
      /** Handle reserved keyword attributes */
      if (RESERVED_WORDS.includes(attr?.name)) {
        /** If we have a user-specified mapping, rename */
        if (attr.name in attributeMapping) {
          const attribute = getMappedAttribute(attr, attributeMapping);
          addAttribute(attribute, result);
          return;
        }
        throwKeywordException(attr, component);
      }

      addAttribute(attr, result);
    });

  return result;
}

function getParams(booleanAttributes, attributes, eventNames) {
  return [
    ...[...(booleanAttributes || []), ...(attributes || [])].map(attr =>
      camelize(attr.name)
    ),
    ...eventNames?.map(event => event.reactName),
  ]?.join(', ');
}

function throwKeywordException(attr, component) {
  throw new Error(
    `Attribute \`${attr.name}\` in custom element \`${component.name}\` is a reserved keyword and cannot be used. Please provide an \`attributeMapping\` in the plugin options to rename the JavaScript variable that gets passed to the attribute.`
  );
}

function addAttribute(attribute, result) {
  if (attribute?.type?.text.includes('boolean')) {
    result.booleanAttributes.push(attribute);
  } else {
    result.attributes.push(attribute);
  }
}

function getMappedAttribute(attr, attributeMapping) {
  return {
    ...attr,
    originalName: attr.name,
    name: attributeMapping[attr.name],
  };
}

function getEvents(eventNames) {
  return eventNames.map(
    event => `
      useEffect(() => {
        if(${event.reactName} !== undefined) {
          component?.addEventListener('${event.name}', ${event.reactName});
        }
      }, [])
    `
  );
}

function getBooleanAttributes(booleanAttributes) {
  return booleanAttributes?.map(
    attr => `
      useEffect(() => {
        if(${attr?.fieldName ?? attr.originalName} !== undefined) {
          if(${attr?.fieldName ?? attr.originalName}) {
            component?.setAttribute('${attr.fieldName}', '');
          } else {
            component?.removeAttribute('${attr.fieldName}');
          }
        }
      }, [${attr?.fieldName ?? attr.name}])
    `
  );
}

function getAttributes(attributes) {
  return attributes?.map(
    attr => `
      useEffect(() => {
        if(${
          attr?.fieldName ?? attr.originalName
        } !== undefined && component?.getAttribute('${
      attr?.originalName ?? attr.fieldName
    }') !== String(${attr?.fieldName ?? attr.originalName})) {
                  component?.setAttribute('${
                    attr?.originalName ?? attr.fieldName
                  }', ${attr?.fieldName ?? attr.originalName})
        }
      }, [${attr?.fieldName ?? attr.originalName}])
  `
  );
}

function getProps(component) {
  const fields = getFields(component);

  return fields?.map(
    member => `
      useEffect(() => {
        if(${member.name} !== undefined && component?.${member.name} !== ${member.name}) {
          component?.${member.name} = ${member.name};
        }
      }, [${member.name}])
  `
  );
}

function getJsxFileContents(
  component,
  events,
  booleanAttributes,
  attributes,
  outdir,
  useTypeScript
) {
  const modulePath = getModulePath(outdir);
  const params = getParams(booleanAttributes, attributes, events);
  const eventTemplates = getEvents(events);
  const booleanAttrTemplates = getBooleanAttributes(booleanAttributes);
  const attrTemplates = getAttributes(attributes);
  const propTemplates = getProps(component);
  const useEffect =
    has(eventTemplates) ||
    has(propTemplates) ||
    has(attrTemplates) ||
    has(booleanAttrTemplates);

  return `
    import React${useEffect ? ', {useEffect, useRef}' : ''} from "react";
    import '${modulePath}';
    ${
      useTypeScript
        ? `import type { ${component.name} as Component } from "${modulePath}";`
        : ''
    }

    ${
      useTypeScript
        ? getCustomElementDeclaration(component)
        : ''
    }

    ${
      useTypeScript
        ? `export interface ${component.name}Props { ${getPropsInterface(
            booleanAttributes,
            attributes,
            events
          )} }`
        : ''
    }

    export function ${component.name}({children${params ? ',' : ''} ${params}}${
    useTypeScript ? `: ${component.name}Props` : ''
  }) {
      ${useEffect ? `const ref = useRef${useTypeScript ? '<Component>' : ''}(null);`: ''}
      ${useEffect ? `const component = ref.current${useTypeScript ? ' as Component' : ''};` : ''}

      ${has(eventTemplates) ? '/** Event listeners - run once */' : ''}
      ${eventTemplates?.join('') || ''}
      ${
        has(booleanAttrTemplates)
          ? '/** Boolean attributes - run whenever an attr has changed */'
          : ''
      }
      ${booleanAttrTemplates?.join('') || ''}
      ${
        has(attrTemplates)
          ? '/** Attributes - run whenever an attr has changed */'
          : ''
      }
      ${attrTemplates?.join('') || ''}
      ${
        has(propTemplates)
          ? '/** Properties - run whenever a property has changed */'
          : ''
      }
      ${propTemplates?.join('') || ''}

      return (
        <${component.tagName} ${useEffect ? 'ref={ref}' : ''}>
          {children}
        </${component.tagName}>
      )
    }
  `;
}

function getPropsInterface(booleanAttributes, attributes, events) {
  return [
    'children?: any;',
    ...[...(booleanAttributes || []), ...(attributes || [])].map(
      attr => `${camelize(attr.name)}?: ${attr.type.text};`
    ),
    ...events?.map(
      event => `${event.reactName}?: EventListenerOrEventListenerObject;`
    ),
  ]?.join('');
}

function getCustomElementDeclaration(component) {
  return `
    declare global {
      // eslint-disable-next-line @typescript-eslint/no-namespace
      namespace JSX {
          interface IntrinsicElements {
              '${component.tagName}': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
          }
      }
    }
  `;
}

function getManifestContent(components) {
  return components
    .map(component => `export * from './${component.name}';`)
    .join('');
}

function getModulePath(outdir) {
  const directories = outdir.split('/');
  return path.join(directories.map(_ => '../').join(''), packageJson.module);
}

function saveFile(outdir, fileName, contents) {
  fs.writeFileSync(
    path.join(outdir, fileName),
    prettier.format(contents, { parser: 'typescript' })
  );
}
