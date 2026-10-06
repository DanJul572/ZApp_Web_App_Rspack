import Icon from '@mui/material/Icon';
import { parseIconName } from '@/helpers/parseIconName';

/**
 * Renders a Material Symbols icon by name (see parseIconName for the format).
 * The font files are self-hosted and only downloaded by the browser when a
 * glyph of that family is actually rendered.
 *
 * "filled" uses the outlined family with FILL 1, while "rounded" and "sharp"
 * are filled too, matching the look of the old MUI icon variants.
 */
const DynamicIcon = ({ name, sx, ...props }) => {
  const parsed = parseIconName(name);
  if (!parsed) return null;

  const { symbol, variant } = parsed;
  const family = variant === 'filled' ? 'outlined' : variant;
  const fill = variant === 'outlined' ? 0 : 1;

  return (
    <Icon
      baseClassName={`material-symbols-${family}`}
      sx={[
        { fontVariationSettings: `'FILL' ${fill}` },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {symbol}
    </Icon>
  );
};

export default DynamicIcon;
