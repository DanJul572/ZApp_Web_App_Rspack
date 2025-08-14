import { v4 as uuidv4 } from 'uuid';

import CActionType from '@/constants/CActionType';
import CButtonType from '@/constants/CButtonType';
import CComponentGroupType from '@/constants/CComponentGroupType';
import CInputType from '@/constants/CInputType';
import CVisualElement from '@/constants/CVisualElementType';

const getInputTypeValue = (value) => {
  for (const key in CInputType) {
    if (CInputType[key].value === value) {
      return CInputType[key];
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
    group: CComponentGroupType.visualElement,
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
        group: CComponentGroupType.fieldControl,
        type: getInputTypeValue(field.inputType),
        properties: {
          label: `"${field.label}"`,
          name: field.name,
        },
      };
      if (
        field.inputType === CInputType.checkbox.value ||
        field.inputType === CInputType.dropdown.value ||
        field.inputType === CInputType.radio.value
      ) {
        pushField.properties.fieldID = field.id;
      }
      content.push(pushField);
    }
  }

  // Generate Button
  content.push({
    id: uuidv4(),
    group: CComponentGroupType.button,
    type: CButtonType.button,
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
    group: CComponentGroupType.visualElement,
    type: CVisualElement.text,
    properties: {
      label: `"Content is not avalaible"`,
      size: 20,
    },
  });
  return content;
};

const generateContent = (module, type) => {
  if (type === CActionType.insert.value) {
    return getInsertContent(module);
  }
};

export { generateContent, generateInvalidContent };
