
import React from 'react';
import { useRive } from '@rive-app/react-canvas';

interface RiveCharacterProps {
  className?: string;
}

const RiveCharacter: React.FC<RiveCharacterProps> = ({ className = "" }) => {
  const { RiveComponent } = useRive({
    src: "/littleboy.riv",
    autoplay: true,
    layout: {
      fit: 'contain',
      alignment: 'center',
    },
  });

  return (
    <div className={`w-full h-full ${className}`}>
      <RiveComponent />
    </div>
  );
};

export default RiveCharacter;
