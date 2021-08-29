export function clear(state, dispatch) {
  if (state.selection.empty) return false;
  const { $from, $to } = state.selection;
  if (dispatch) dispatch(state.tr.removeMark($from.pos, $to.pos, null));
  return true;
}
