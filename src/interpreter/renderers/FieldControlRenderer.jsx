import Checkbox from '@/components/input/Checkbox';
import Code from '@/components/input/Code';
import DateField from '@/components/input/DateField';
import Datetime from '@/components/input/Datetime';
import Dropdown from '@/components/input/Dropdown';
import File from '@/components/input/File';
import LongText from '@/components/input/LongText';
import NumberField from '@/components/input/NumberField';
import Password from '@/components/input/Password';
import Radio from '@/components/input/Radio';
import Ratings from '@/components/input/Ratings';
import RichText from '@/components/input/RichText';
import ShortText from '@/components/input/ShortText';
import Slider from '@/components/input/Slider';
import Time from '@/components/input/Time';
import Toggle from '@/components/input/Toggle';
import EInputType from '@/enums/EInputType';
import ScriptEngine from '../script/ScriptEngine';

const PLACEHOLDER_OPTIONS = [
  { label: 'Value 1', value: 1 },
  { label: 'Value 2', value: 2 },
  { label: 'Value 3', value: 3 },
];

const FieldControlRenderer = (props) => {
  const { isBuilder, type, properties } = props;

  const scriptEngine = ScriptEngine({ isBuilder });
  // Dibaca lewat ScriptEngine agar field hanya re-render saat nilainya
  // sendiri berubah, bukan setiap kali field lain diketik
  const { formData, uiStore } = scriptEngine.zcore;

  const name = properties.name;
  const color = properties.color ? properties.color.name : 'primary';
  const disabled = !name || Boolean(scriptEngine.evaluate(properties.disable));
  const fieldID = properties.fieldID;
  const hidden = scriptEngine.evaluate(properties.hidden);
  const label = scriptEngine.evaluate(properties.label);
  const multiple = scriptEngine.evaluate(properties.multiple);

  const handleChange = (value) => {
    if (!isBuilder && name) {
      formData.set(name, value);
    }
  };

  const inputProps = {
    value: formData.get(name) || null,
    onChange: handleChange,
    disabled: disabled,
    label: label || null,
  };

  if (hidden) return null;

  switch (type) {
    case EInputType.shortText.value:
      return <ShortText {...inputProps} />;

    case EInputType.longText.value:
      return <LongText {...inputProps} rows={4} />;

    case EInputType.number.value:
      return <NumberField {...inputProps} />;

    case EInputType.toggle.value:
      return <Toggle {...inputProps} />;

    case EInputType.dropdown.value: {
      const dropdownProps = isBuilder
        ? inputProps
        : { ...inputProps, id: fieldID };
      return <Dropdown {...dropdownProps} multiple={multiple} />;
    }

    case EInputType.date.value:
      return <DateField {...inputProps} />;

    case EInputType.time.value:
      return <Time {...inputProps} />;

    case EInputType.file.value: {
      const tempFileName = uiStore.get('tempData')?.[name] || null;
      return <File {...inputProps} name={name} value={tempFileName} />;
    }

    case EInputType.richText.value:
      return <RichText {...inputProps} />;

    case EInputType.radio.value:
      return <Radio {...inputProps} options={PLACEHOLDER_OPTIONS} />;

    case EInputType.checkbox.value:
      return <Checkbox {...inputProps} options={PLACEHOLDER_OPTIONS} />;

    case EInputType.datetime.value:
      return <Datetime {...inputProps} />;

    case EInputType.slider.value:
      return <Slider {...inputProps} color={color} />;

    case EInputType.password.value:
      return <Password {...inputProps} color={color} />;

    case EInputType.code.value:
      return <Code {...inputProps} withOptions={true} />;

    case EInputType.ratings.value:
      return <Ratings {...inputProps} />;

    default:
      return null;
  }
};

export default FieldControlRenderer;
