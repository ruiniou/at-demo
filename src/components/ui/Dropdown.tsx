import React from "react";
import {
  SingleSelect,
  type SingleSelectOption,
  type SingleSelectProps,
} from "./SingleSelect";

export type DropdownOption = SingleSelectOption;
export type DropdownProps = SingleSelectProps;

/** Compatibility wrapper. New Fundamental consumers should import SingleSelect directly. */
export function Dropdown(props: DropdownProps) {
  return <SingleSelect {...props} />;
}

export { SingleSelect };
export type { SingleSelectProps };
