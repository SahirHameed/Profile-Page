import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  download,
  onClick,
  className = '',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        download={download}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
