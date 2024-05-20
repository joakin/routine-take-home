export type Suggestions =
  | {
      kind: "Loading";
      // The previous response if any
      response: string[];
    }
  | {
      kind: "Success";
      response: string[];
    }
  | {
      kind: "Error";
      err: Error;
    };

export function getLoadingSuggestions(
  oldSuggestions: Suggestions | null,
): Suggestions {
  return {
    kind: "Loading",
    response:
      oldSuggestions &&
      (oldSuggestions.kind === "Loading" || oldSuggestions.kind === "Success")
        ? oldSuggestions.response
        : [],
  };
}

export async function getSuggestions(query: string): Promise<Suggestions> {
  const response = await fetch(
    `https://bleeding.routine.co:8080/completion?query=${encodeURIComponent(query)}`,
  );
  if (!response.ok) {
    return {
      kind: "Error",
      err: new Error(response.statusText),
    };
  }

  // TODO: Use a schema validator library in order to have real type safety in
  // case the responses have an unexpected format.
  const suggestions: { phrase: string; score: number }[] = (
    await response.json()
  ).completions;
  suggestions.sort((a, b) => b.score - a.score);
  return {
    kind: "Success",
    response: suggestions.map((suggestion) => suggestion.phrase),
  };
}
