import { useEffect, useState } from "react";
import type StateZ from "statez";

export function useStateZ(
  $key: string,
  $stateName: string = "__statez__"
): [string, (value: any) => void] {
  //@ts-ignore
  const $state = window[$stateName] as StateZ;
  const [state, setState] = useState("");
  if ($state === undefined) {
    //@ts-ignore
    window[$stateName] = null;
    console.error(`State key ${$key} not exists`);
  }
  if (!$state || !$state.value[$key]) {
    return [state, setState];
  }
  const handleSubscription = (value: any, _: any, stateKey: string | null) => {
    if (stateKey === $key) setState(value.value);
    if (stateKey === null) setState(value[$key].value);
  };

  const setStateValue = (value: any) => {
    $state.set($key, {
      ...$state.value[$key],
      value,
    });
  };

  useEffect(() => {
    $state.subscribe(handleSubscription, true);
    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      $state.unsubscribe(handleSubscription);
    };
  }, []); // Empty dependency array ensures the effect runs once on mount

  return [state, setStateValue];
}
