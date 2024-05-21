const nonBreakingSpace = "\u00A0";

function isTextNode(node: Node): node is Text {
  return node.nodeType === Node.TEXT_NODE;
}

function isSpanNode(node: Node): node is HTMLSpanElement {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    (node as HTMLElement).tagName === "SPAN"
  );
}

function wrapTextNode(node: Text, className: string): HTMLElement {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = node.nodeValue;
  node.replaceWith(span);
  return span;
}

function unwrapSpanNode(span: HTMLElement): Text {
  const selection = window.getSelection();
  let cursorOffset = null;

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (
      range.startContainer === span ||
      range.endContainer === span ||
      range.startContainer === span.firstChild ||
      range.endContainer === span.firstChild
    ) {
      cursorOffset = range.startOffset;
    }
  }

  const textNode = document.createTextNode(span.textContent || "");
  span.replaceWith(textNode);

  if (cursorOffset !== null && selection) {
    const range = document.createRange();
    range.setStart(textNode, cursorOffset);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  return textNode;
}

function splitTextNode(node: Text, index: number): [Text, Text] {
  const textBefore = node.nodeValue!.slice(0, index);
  const textAfter = node.nodeValue!.slice(index);
  const beforeNode = document.createTextNode(textBefore);
  const afterNode = document.createTextNode(textAfter);
  node.replaceWith(beforeNode, afterNode);
  return [beforeNode, afterNode];
}

function mergeContiguousNodes(parent: HTMLElement) {
  const selection = window.getSelection();
  let cursorPos = 0;

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const preCursorRange = range.cloneRange();
    preCursorRange.selectNodeContents(parent);
    preCursorRange.setEnd(range.startContainer, range.startOffset);
    cursorPos = preCursorRange.toString().length;
  }

  for (let i = 0; i < parent.childNodes.length - 1; i++) {
    const currentNode = parent.childNodes[i];
    const nextNode = parent.childNodes[i + 1];

    if (isTextNode(currentNode) && isTextNode(nextNode)) {
      currentNode.nodeValue! += nextNode.nodeValue;
      nextNode.remove();
      i--; // Recheck the current node with the next
    } else if (isSpanNode(currentNode) && isSpanNode(nextNode)) {
      if (currentNode.className === nextNode.className) {
        currentNode.textContent! += nextNode.textContent;
        nextNode.remove();
        i--; // Recheck the current node with the next
      }
    }
  }

  if (selection) {
    let charCount = 0;
    for (let i = 0; i < parent.childNodes.length; i++) {
      const node = parent.childNodes[i];
      const nodeLength = node.textContent?.length || 0;

      if (charCount + nodeLength >= cursorPos) {
        const range = document.createRange();
        const offset = cursorPos - charCount;
        const childNode = node.childNodes[0];

        if (childNode) {
          range.setStart(childNode, offset);
        } else {
          range.setStart(node, offset);
        }

        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        break;
      }
      charCount += nodeLength;
    }
  }
}

const chipClass = "console-input-chip";
const keywordClass = "console-input-keyword";

function isKeywordNode(node: Node): node is HTMLSpanElement {
  return isSpanNode(node) && node.classList.contains(keywordClass);
}

function isChipNode(node: Node): node is HTMLSpanElement {
  return isSpanNode(node) && node.classList.contains(chipClass);
}

/**
 * Handle changes to the input box by merging contiguous same type nodes, and
 * parsing the text to create keyword and chip spans.
 */
export function handleInputChange(
  input: HTMLDivElement,
  _event: InputEvent,
): { requestCompletions: string | null } {
  const keywordPattern = /I pick you/;
  const keywordPatternStrict = /^I pick you$/;
  const keywordPatternWithSpace = /^I pick you(?: |\u00A0)$/;
  const nodes = input.childNodes;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (isTextNode(node) && keywordPattern.test(node.nodeValue || "")) {
      const match = keywordPattern.exec(node.nodeValue!);
      if (match) {
        const startIndex = match.index;

        const [_beforeKeyword, afterKeyword] = splitTextNode(node, startIndex);
        const [keywordNode, _afterKeywordNode] = splitTextNode(
          afterKeyword,
          match[0].length,
        );

        const keywordSpan = wrapTextNode(keywordNode, keywordClass);
        setCursorAfterNode(keywordSpan);

        i += 1;
      }
    } else if (isKeywordNode(node)) {
      if (keywordPatternWithSpace.test(node.textContent || "")) {
        node.textContent = node.textContent!.slice(0, -1);

        const space = document.createTextNode(nonBreakingSpace);
        node.after(space);
        setCursorAfterNode(space);
      } else if (!keywordPatternStrict.test(node.textContent || "")) {
        unwrapSpanNode(node);
        if (i + 1 < nodes.length) {
          const anotherNode = nodes[i + 1];
          if (isChipNode(anotherNode)) {
            unwrapSpanNode(anotherNode);
          }
        }
        if (i + 2 < nodes.length) {
          const anotherNode = nodes[i + 2];
          if (isChipNode(anotherNode)) {
            unwrapSpanNode(anotherNode);
          }
        }
      }
    } else if (isTextNode(node) && i > 0 && isKeywordNode(nodes[i - 1])) {
      const match = /^(\s+)(\w+)/.exec(node.nodeValue!);
      if (match) {
        const [spaces, afterSpaces] = splitTextNode(node, match[1].length);
        spaces.textContent = nonBreakingSpace;
        const [wordNode, _afterWordNode] = splitTextNode(
          afterSpaces,
          match[2].length,
        );

        const wordSpan = wrapTextNode(wordNode, chipClass);
        setCursorAtEndOfNode(wordSpan.firstChild!);

        i += 1;
      }
    } else if (isChipNode(node)) {
      if (node.textContent!.length === 0) {
        node.textContent = nonBreakingSpace;
      } else if (node.textContent!.length > 1) {
        const textContent = node.textContent!;
        const spaceIndex = Math.max(
          textContent.lastIndexOf(" "),
          textContent.lastIndexOf(nonBreakingSpace),
        );

        if (spaceIndex > 0) {
          const beforeSpace = textContent.slice(0, spaceIndex);
          let afterSpace = textContent.slice(spaceIndex);
          if (afterSpace.length === 1) {
            afterSpace = nonBreakingSpace;
          }

          node.textContent = beforeSpace;

          const afterNode = document.createTextNode(afterSpace);
          node.after(afterNode);

          // Skip the space at the beginning
          setCursorAfterNode(afterNode);
        }
      }
    }

    // Remove any empty spans
    if (
      isSpanNode(node) &&
      !node.textContent!.trim() &&
      document.activeElement !== node
    ) {
      node.remove();
      i--;
    }
  }

  mergeContiguousNodes(input);

  const requestCompletions = getChipWordAtCursor(input);
  return { requestCompletions };
}

export function getChipWordAtCursor(input: HTMLDivElement): string | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);

  for (const node of input.childNodes) {
    if (
      isChipNode(node) &&
      (selection.containsNode(node, true) ||
        (node.firstChild && selection.containsNode(node.firstChild, true)))
    ) {
      return node.textContent?.trim() || null;
    }
  }

  return null;
}

function setCursorAfterNode(node: Node) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStartAfter(node);
  range.collapse(true);
  sel?.removeAllRanges();
  sel?.addRange(range);
}

function setCursorAtEndOfNode(node: Node) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(node);
  range.collapse(false);
  sel?.removeAllRanges();
  sel?.addRange(range);
}

/**
 * Complete the contents of a chip and move the cursor to the end
 */
export function completeChipContent(input: HTMLDivElement, content: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  const chipNode = range.startContainer;

  if (chipNode && isChipNode(chipNode.parentNode!)) {
    const chipElement = chipNode.parentNode as HTMLSpanElement;
    chipElement.textContent = content;

    const spaceNode = document.createTextNode(nonBreakingSpace);
    chipElement.after(spaceNode);

    setCursorAfterNode(spaceNode);
  }
}
