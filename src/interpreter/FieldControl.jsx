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

import Runner from '@/runner';

const FieldControl = (props) => {
  const { isBuilder, type, properties } = props;

  const { getValues } = Runner({ isBuilder });
  const VarsHook = Vars();
  const CompHook = Comp();

  const name = properties.name;
  const color = properties.color ? properties.color.name : 'primary';
  const disabled = !name || Boolean(getValues(properties.disable));
  const label = getValues(properties.label);
  const hidden = getValues(properties.hidden);
  const multiple = getValues(properties.multiple);
  const fieldID = properties.fieldID;

  const onChange = (value) => {
    if (!isBuilder) {
      if (name) {
        VarsHook.set(name, value);
      }
    }
  };

  const comProps = {
    value: VarsHook.get(name) || null,
    onChange: onChange,
    disabled: disabled,
    label: label || null,
  };

  const content = () => {
    if (!hidden) {
      if (type === CInputType.shortText.value) {
        return <ShortText {...comProps} />;
      }

      if (type === CInputType.longText.value) {
        return <LongText {...comProps} rows={4} />;
      }

      if (type === CInputType.number.value) {
        return <NumberField {...comProps} />;
      }

      if (type === CInputType.toggle.value) {
        return <Toggle {...comProps} />;
      }

      if (type === CInputType.dropdown.value) {
        if (!isBuilder) comProps.id = fieldID;
        return <Dropdown {...comProps} multiple={multiple} />;
      }

      if (type === CInputType.date.value) {
        return <DateField {...comProps} />;
      }

      if (type === CInputType.time.value) {
        return <Time {...comProps} />;
      }

      if (type === CInputType.file.value) {
        const tempFileName = CompHook.get('tempData')
          ? CompHook.get('tempData')[name]
          : null;
        return <File {...comProps} name={name} value={tempFileName} />;
      }

      if (type === CInputType.richText.value) {
        return <RichText {...comProps} />;
      }

      if (type === CInputType.radio.value) {
        return (
          <Radio
            {...comProps}
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
            {...comProps}
            options={[
              { label: 'Value 1', value: 1 },
              { label: 'Value 2', value: 2 },
              { label: 'Value 3', value: 3 },
            ]}
          />
        );
      }

      if (type === CInputType.datetime.value) {
        return <Datetime {...comProps} />;
      }

      if (type === CInputType.slider.value) {
        return <Slider {...comProps} color={color} />;
      }

      if (type === CInputType.password.value) {
        return <Password {...comProps} color={color} />;
      }

      if (type === CInputType.code.value) {
        return <Code {...comProps} withOptions={true} />;
      }

      if (type === CInputType.ratings.value) {
        return <Ratings {...comProps} />;
      }
    }
  };

  return content();
};

export default FieldControl;
