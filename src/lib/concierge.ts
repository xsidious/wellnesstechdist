export function conciergeReply(text: string) {
  const question = text.toLowerCase();
  if (question.includes("dose") || question.includes("side") || question.includes("interact")) {
    return "A pharmacist needs to answer dosing, side-effect, or interaction questions. This concierge will not guess.";
  }
  if (question.includes("where") || question.includes("track") || question.includes("ship")) {
    return "Status is on this page. If the package was cold-chain packed, refrigerate it when it arrives.";
  }
  if (question.includes("refill")) {
    return "Refills are drafted before run-out. A prescriber approves them, then autopay uses the saved token.";
  }
  return "I can help with tracking, refrigeration, and refill timing. Clinical questions go to a pharmacist.";
}
