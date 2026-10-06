const ICON_VARIANTS = ['filled', 'outlined', 'rounded', 'sharp'];

const LEGACY_SUFFIXES = {
  Outlined: 'outlined',
  Rounded: 'rounded',
  Sharp: 'sharp',
  TwoTone: 'outlined',
};

/**
 * Icon values are stored as "<symbol>" (filled) or "<symbol>:<variant>",
 * e.g. "home", "home:outlined". Legacy MUI names such as "HomeOutlined" are
 * still accepted and converted to their Material Symbols equivalent.
 */
const parseIconName = (value) => {
  if (!value) return null;

  const [symbol, variant] = value.split(':');

  if (/[A-Z]/.test(symbol)) {
    const suffix = Object.keys(LEGACY_SUFFIXES).find((s) => symbol.endsWith(s));
    const base = suffix ? symbol.slice(0, -suffix.length) : symbol;

    return {
      symbol: base
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/([a-zA-Z])(\d)/g, '$1_$2')
        .toLowerCase(),
      variant: suffix ? LEGACY_SUFFIXES[suffix] : 'filled',
    };
  }

  return {
    symbol,
    variant: ICON_VARIANTS.includes(variant) ? variant : 'filled',
  };
};

const formatIconName = (symbol, variant) =>
  variant === 'filled' ? symbol : `${symbol}:${variant}`;

export { formatIconName, ICON_VARIANTS, parseIconName };
