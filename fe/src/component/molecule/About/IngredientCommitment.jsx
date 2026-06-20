import React from 'react';
import CheckIcon from '../../atom/About/CheckIcon';

export default function IngredientCommitment({ text }) {
  return (
    <li className="flex items-center gap-4 text-base font-normal text-text-main">
      <CheckIcon />
      <span>{text}</span>
    </li>
  );
}
