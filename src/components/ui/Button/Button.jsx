import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';

/**
 * Button Component - A reusable, animated button like ShadCN
 *
 * @param {string} variant - Button style: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
 * @param {string} size - Button size: 'sm' | 'md' | 'lg' | 'icon'
 * @param {string} className - Additional custom classes
 * @param {boolean} disabled - Disable the button
 * @param {boolean} loading - Show loading state
 * @param {React.ReactNode} children - Button content
 * @param {string} type - Button type: 'button' | 'submit' | 'reset'
 * @param {function} onClick - Click handler
 */

const buttonVariants = {
  primary: [
    'bg-primary text-gray-900',
    'hover:bg-primary/80',
    'active:bg-primary/60',
    'focus-visible:ring-primary/50',
  ],
  secondary: [
    'bg-gray-100 text-gray-900',
    'hover:bg-gray-200',
    'active:bg-gray-300',
    'focus-visible:ring-gray-300/50',
  ],
  outline: [
    'border border-gray-300 bg-transparent text-gray-700',
    'hover:bg-gray-50 hover:border-gray-400',
    'active:bg-gray-100',
    'focus-visible:ring-gray-300/50',
  ],
  ghost: [
    'bg-transparent text-gray-700',
    'hover:bg-gray-100',
    'active:bg-gray-200',
    'focus-visible:ring-gray-300/50',
  ],
  destructive: [
    'bg-red-500 text-white',
    'hover:bg-red-600',
    'active:bg-red-700',
    'focus-visible:ring-red-500/50',
  ],
  link: [
    'bg-transparent text-[#b9bbf6] underline-offset-4',
    'hover:underline',
    'active:text-[#9799f4]',
    'focus-visible:ring-[#b9bbf6]/50',
  ],
};

const buttonSizes = {
  sm: 'h-8 px-3 text-sm rounded-full',
  md: 'h-10 px-4 text-sm rounded-full',
  lg: 'h-12 px-6 text-base rounded-full',
  icon: 'h-10 w-10 rounded-full',
};

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      disabled = false,
      loading = false,
      children,
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={clsx(
          'inline-flex items-center justify-center gap-2',
          'font-medium whitespace-nowrap',
          'transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'cursor-pointer',

          buttonVariants[variant],

          buttonSizes[size],

          isDisabled && ['cursor-not-allowed opacity-50', 'pointer-events-none'],

          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
