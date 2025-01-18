import PropTypes from "prop-types";
export const SolutionSteps = (props) => {
  return (
    <div className="steps-container">
      <h4>Solution Steps:</h4>
      <ol>
        {props.msg.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

SolutionSteps.propTypes = {
  msg: PropTypes.shape({
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
