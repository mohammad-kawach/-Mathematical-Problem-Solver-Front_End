import PropTypes from "prop-types";
export const MathGraph = (props) => {
  return (
    <div className="graph-container">
      <img src={props.msg.graph} alt="Mathematical graph" />
    </div>
  );
};

MathGraph.propTypes = {
  msg: PropTypes.shape({
    graph: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
