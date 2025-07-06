import { useRive } from '@rive-app/react-canvas';

export default function LittleBoyInteractive() {
  const { RiveComponent } = useRive({
    src: "/littleboy.riv", // ✅ Use string path, not import
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return (
    <div className='w-full h-full min-w-0 min-h-0'>
      <RiveComponent 
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}

