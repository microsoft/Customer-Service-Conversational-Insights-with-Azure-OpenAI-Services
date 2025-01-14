import React from "react";

interface CardProps {
  value: number | string;
  description: string;
  unit_of_measurement: string;
  containerHeight: number;
}

const Card: React.FC<CardProps> = ({
  value,
  description,
  unit_of_measurement,
  containerHeight,
}) => {
  return (
    <div>
      <div
        className="percentage"
      >{`${value}${unit_of_measurement}`}</div>
    </div>
  );
};

export default Card;
