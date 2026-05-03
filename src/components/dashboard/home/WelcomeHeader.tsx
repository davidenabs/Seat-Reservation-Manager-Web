import { DateTime } from 'luxon';

interface WelcomeHeaderProps {
  user: any;
  getGreeting: () => string;
}

export default function WelcomeHeader({ user, getGreeting }: WelcomeHeaderProps) {
  return (
    <div className="mb-6">
      <p className="text-[10px] md:text-[11px] text-gray-400 font-bold uppercase tracking-[1px] mb-2">
        {DateTime.now().setZone('Africa/Lagos').toFormat('cccc, d LLLL yyyy').toUpperCase()}
      </p>
      <h2 className="font-fraunces italic font-light text-[32px] md:text-[52px] leading-tight tracking-[-1px]">
        {getGreeting()}, {user?.name?.split(' ')[0] || 'Member'}.
      </h2>
    </div>
  );
}
