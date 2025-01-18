import PropTypes from "prop-types";
export const QuickActionsButton = (props) => {
  return (
    <button onClick={() => props.setUserInput(props.mathShow)}>
      {props.mathIssue}
    </button>
  );
};

QuickActionsButton.propTypes = {
  setUserInput: PropTypes.func.isRequired,
  mathShow: PropTypes.string.isRequired,
  mathIssue: PropTypes.func.isRequired,
};
