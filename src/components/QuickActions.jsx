import PropTypes from "prop-types";
import { QuickActionsButton } from "./QuickActionsButton";

const QuickActions = (props) => (
  <div className="quick-actions">
    <QuickActionsButton
      setUserInput={props.setUserInput}
      mathIssue="sin(2-x)*cos(3*x/2)"
      mathShow="sin(2-x)*cos(3*x/2)"
    />
    <QuickActionsButton
      setUserInput={props.setUserInput}
      mathIssue="x^2+y-2=1"
      mathShow="x^2+y-2=1"
    />
  </div>
);

QuickActions.propTypes = {
  setUserInput: PropTypes.func.isRequired,
};

export default QuickActions;
