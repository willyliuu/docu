import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return <input className={`${className}`} {...props} />;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => {
  return <textarea className={`${className}`} {...props} />;
};
