/* Fluent UI Web Components — JSX type declarations for React */

declare namespace JSX {
  interface IntrinsicElements {
    'fluent-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      appearance?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
      size?: 'small' | 'medium' | 'large';
      shape?: 'rounded' | 'circular' | 'square';
      disabled?: boolean;
      'icon-only'?: boolean;
    }, HTMLElement>;

    'fluent-badge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      appearance?: 'filled' | 'ghost' | 'outline' | 'accent' | 'tint';
      size?: 'small' | 'medium' | 'large';
      shape?: 'rounded' | 'circular' | 'square';
      color?: 'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning';
    }, HTMLElement>;

    'fluent-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      appearance?: 'filled' | 'filled-alternative' | 'outline' | 'subtle';
      size?: 'small' | 'medium' | 'large';
      orientation?: 'horizontal' | 'vertical';
      'focus-mode'?: 'off' | 'no-tab' | 'tab-exit' | 'tab-only';
    }, HTMLElement>;

    'fluent-divider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      appearance?: 'default' | 'brand' | 'strong' | 'subtle';
      orientation?: 'horizontal' | 'vertical';
      align?: 'start' | 'center' | 'end';
    }, HTMLElement>;

    'fluent-text': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      size?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '1000';
      weight?: 'regular' | 'medium' | 'semibold' | 'bold';
      align?: 'start' | 'center' | 'end' | 'justify';
      block?: boolean;
      nowrap?: boolean;
      truncate?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
    }, HTMLElement>;

    'fluent-accordion': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'fluent-accordion-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      expanded?: boolean;
      'heading-level'?: '1' | '2' | '3' | '4' | '5' | '6';
    }, HTMLElement>;
  }
}
