import {cn} from "@/lib/utils.ts";

interface LogoProps {
  className?: string
}

export const Logo = ({className}: LogoProps) => {
  return (
    <div className={cn('flex gap-2', className)}>
      <div className={'size-6 rounded-full flex justify-center items-center bg-[#1677ff]'}>
        <div className={'size-3 rounded-full bg-white'}/>
      </div>
      <span className={'text-black opacity-85 font-semibold'}>Company</span>
    </div>
  );
};
