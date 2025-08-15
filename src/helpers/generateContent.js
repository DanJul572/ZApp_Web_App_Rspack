import { v4 as uuidv4 } from 'uuid';

import EActionType from '@/enums/EActionType';
import EButtonType from '@/enums/EButtonType';
import EComponentGroupType from '@/enums/EComponentGroupType';
import EInputType from '@/enums/EInputType';
import CVisualElement from '@/enums/EVisualElementType';

const getInputTypeValue = (value) => {
  for (const key in EInputType) {
    if (EInputType[key].value === value) {
      return EInputType[key];
    }
  }
  return null;
};

const getInsertContent = (module) => {
  const content = [];
  const fields = module.fields.filter((field) => field.id);

  // Generate Title
  content.push({
    id: uuidv4(),
    group: EComponentGroupType.visualElement,
    type: CVisualElement.text,
    properties: {
      label: `"${module.label}"`,
      size: 20,
    },
  });

  // Generate Field
  for (let index = 0; index < fields.length; index++) {
    const field = fields[index];
    if (!field.autoIncrement) {
      const pushField = {
        id: uuidv4(),
        group: EComponentGroupType.fieldControl,
        type: getInputTypeValue(field.inputType),
        properties: {
          label: `"${field.label}"`,
          name: field.name,
        },
      };
      if (
        field.inputType === EInputType.checkbox.value ||
        field.inputType === EInputType.dropdown.value ||
        field.inputType === EInputType.radio.value
      ) {
        pushField.properties.fieldID = field.id;
      }
      content.push(pushField);
    }
  }

  // Generate Button
  content.push({
    id: uuidv4(),
    group: EComponentGroupType.button,
    type: EButtonType.button,
    properties: {
      label: '"Insert"',
      display: {
        horizontal: {
          name: 'right',
          value: 'flex-end',
          type: 'horizontal',
        },
      },
    },
  });

  return content;
};

const generateInvalidContent = () => {
  const content = [];

  content.push({
    id: uuidv4(),
    group: EComponentGroupType.visualElement,
    type: CVisualElement.text,
    properties: {
      label: `"Content is not avalaible"`,
      size: 20,
    },
  });
  return content;
};

const generateContent = (module, type) => {
  if (type === EActionType.insert.value) {
    return getInsertContent(module);
  }
};

export { generateContent, generateInvalidContent };
