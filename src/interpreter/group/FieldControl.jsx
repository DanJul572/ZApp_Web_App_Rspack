import Checkbox from '@/componentss/input/Checkbox';
import Code from '@/componentss/input/Code';
import DateField from '@/componentss/input/DateField';
import Datetime from '@/componentss/input/Datetime';

import Dropdown from '@/componentss/input/Dropdown';
import File from '@/componentss/input/File';
import LongText from '@/componentss/input/LongText';
import NumberField from '@/componentss/input/NumberField';
import Password from '@/componentss/input/Password';
import Radio from '@/componentss/input/Radio';
import Ratings from '@/componentss/input/Ratings';
import RichText from '@/componentss/input/RichText';
import ShortText from '@/componentss/input/ShortText';
import Slider from '@/componentss/input/Slider';
import Time from '@/componentss/input/Time';
import Toggle from '@/componentss/input/Toggle';

import CInputType from '@/constantss/CInputType';
import FormData from '@/hooks/FormData';
import UIStore from '@/hooks/UIStore';

import Waiter from '@/interpreter/waiter';

const FieldControl = (props) => {
  const { isBuilder, type, properties } = props;

  const waiter = Waiter({ isBuilder });
  const formData = FormData();
  const uiStore = UIStore();

  const name = properties.name;
  const color = properties.color ? properties.color.name : 'primary';
  const disabled = !name || Boolean(waiter.take(properties.disable));
  const fieldID = properties.fieldID;
  const hidden = waiter.take(properties.hidden);
  const label = waiter.take(properties.label);
  const multiple = waiter.take(properties.multiple);

  const onChange = (value) => {
    if (!isBuilder) {
      if (name) {
        formData.set(name, value);
      }
    }
  };

  const componentProps = {
    value: formData.get(name) || null,
    onChange: onChange,
    disabled: disabled,
    label: label || null,
  };

  if (!hidden) {
    if (type === CInputType.shortText.value) {
      return <ShortText {...componentProps} />;
    }

    if (type === CInputType.longText.value) {
      return <LongText {...componentProps} rows={4} />;
    }

    if (type === CInputType.number.value) {
      return <NumberField {...componentProps} />;
    }

    if (type === CInputType.toggle.value) {
      return <Toggle {...componentProps} />;
    }

    if (type === CInputType.dropdown.value) {
      if (!isBuilder) {
        componentProps.id = fieldID;
      }
      return <Dropdown {...componentProps} multiple={multiple} />;
    }

    if (type === CInputType.date.value) {
      return <DateField {...componentProps} />;
    }

    if (type === CInputType.time.value) {
      return <Time {...componentProps} />;
    }

    if (type === CInputType.file.value) {
      const tempFileName = uiStore.get('tempData')?.[name] || null;
      return <File {...componentProps} name={name} value={tempFileName} />;
    }

    if (type === CInputType.richText.value) {
      return <RichText {...componentProps} />;
    }

    if (type === CInputType.radio.value) {
      return (
        <Radio
          {...componentProps}
          options={[
            { label: 'Value 1', value: 1 },
            { label: 'Value 2', value: 2 },
            { label: 'Value 3', value: 3 },
          ]}
        />
      );
    }

    if (type === CInputType.checkbox.value) {
      return (
        <Checkbox
          {...componentProps}
          options={[
            { label: 'Value 1', value: 1 },
            { label: 'Value 2', value: 2 },
            { label: 'Value 3', value: 3 },
          ]}
        />
      );
    }

    if (type === CInputType.datetime.value) {
      return <Datetime {...componentProps} />;
    }

    if (type === CInputType.slider.value) {
      return <Slider {...componentProps} color={color} />;
    }

    if (type === CInputType.password.value) {
      return <Password {...componentProps} color={color} />;
    }

    if (type === CInputType.code.value) {
      return <Code {...componentProps} withOptions={true} />;
    }

    if (type === CInputType.ratings.value) {
      return <Ratings {...componentProps} />;
    }
  }
};

export default FieldControl;
