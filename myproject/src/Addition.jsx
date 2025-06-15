import React from "react";
 
function Addition(props) {
  const { num1, num2 } = props;
  const sum = Number(num1) + Number(num2);
 
  return (
    <div>
      <p>
        The sum of {props.num1} and {props.num2} is {sum}
      </p>
    </div>
  );
}
 
export default Addition;