import Checkbox from '@/component/input/Checkbox';
import Code from '@/component/input/Code';
import DateField from '@/component/input/DateField';
import Datetime from '@/component/input/Datetime';

import Dropdown from '@/component/input/Dropdown';
import File from '@/component/input/File';
import LongText from '@/component/input/LongText';
import NumberField from '@/component/input/NumberField';
import Password from '@/component/input/Password';
import Radio from '@/component/input/Radio';
import Ratings from '@/component/input/Ratings';
import RichText from '@/component/input/RichText';
import ShortText from '@/component/input/ShortText';
import Slider from '@/component/input/Slider';
import Time from '@/component/input/Time';
import Toggle from '@/component/input/Toggle';

import CInputType from '@/constant/CInputType';

import Comp from '@/hook/Comp';
import Vars from '@/hook/Vars';

import Waiter from '@/interpreter/waiter';

const FieldControl = (props) => {
  const { isBuilder, type, properties } = props;

  const waiter = Waiter({ isBuilder });
  const vars = Vars();
  const comp = Comp();

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
        vars.set(name, value);
      }
    }
  };

  const componentProps = {
    value: vars.get(name) || null,
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
      const tempFileName = comp.get('tempData')?.[name] || null;
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
