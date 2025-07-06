
import React from 'react';
import { useRive, Fit, Alignment } from '@rive-app/react-canvas';

interface RiveCharacterProps {
  className?: string;
}

const RiveCharacter: React.FC<RiveCharacterProps> = ({ className = "" }) => {
  const { RiveComponent } = useRive({
    src: "/littleboy.riv",
    autoplay: true,
    fit: Fit.Contain,
    alignment: Alignment.Center,
  });

  return (
    <div className={`w-full h-full ${className}`}>
      <RiveComponent />
    </div>
  );
};

export default RiveCharacter;
