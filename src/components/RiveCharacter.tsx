
import React from 'react';
import { useRive } from '@rive-app/react-canvas';

interface RiveCharacterProps {
  className?: string;
}

const RiveCharacter: React.FC<RiveCharacterProps> = ({ className = "" }) => {
  const { rive, RiveComponent } = useRive({
    src: "/littleboy.riv",
    autoplay: true,
  });

  return (
    <div className={`w-full h-full ${className}`}>
      <RiveComponent 
        onMouseEnter={() => rive && rive.play()}
        onMouseLeave={() => rive && rive.pause()}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default RiveCharacter;
