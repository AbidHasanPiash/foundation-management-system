'use client';
import React from 'react';

const Button = ({ className, title, children, ...props }) => (
    <button className={className} {...props}>
        {title || children}
    </button>
);

export const SketchButton = (props) => (
    <Button
        className='px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'
        title={props.title || 'Sketch'}
        {...props}
    >
        {props.title || 'Sketch'}
    </Button>
);

export const SimpleButton = (props) => (
    <Button
        className='px-4 py-2 rounded-md border border-neutral-300 bg-neutral-100 text-neutral-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md'
        title={props.title || 'Simple'}
        {...props}
    >
        {props.title || 'Simple'}
    </Button>
);

export const InvertButton = (props) => (
    <Button
        className='px-8 py-2 rounded-md bg-teal-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500'
        title={props.title || 'Invert it'}
        {...props}
    >
        {props.title || 'Invert it'}
    </Button>
);

export const TailwindConnectButton = (props) => (
    <Button
        className='bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block'
        title={props.title || 'Tailwind Connect'}
        {...props}
    >
        <div className='relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10'>
            <span>{props.title || 'Tailwind Connect'}</span>
            <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                    d='M10.75 8.75L14.25 12L10.75 15.25'
                ></path>
            </svg>
        </div>
    </Button>
);

export const GradientButton = (props) => (
    <Button
        className='px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200'
        title={props.title || 'Gradient'}
        {...props}
    >
        {props.title || 'Gradient'}
    </Button>
);

export const UnapologeticButton = (props) => (
    <Button
        className='px-8 py-2 border border-black bg-transparent text-black dark:border-white relative group transition duration-200'
        title={props.title || 'Unapologetic'}
        {...props}
    >
        <div className='absolute -bottom-2 -right-2 bg-yellow-300 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200' />
        <span>{props.title || 'Unapologetic'}</span>
    </Button>
);

export const LitUpBordersButton = (props) => (
    <Button
        className='p-[3px] relative'
        title={props.title || 'Lit up borders'}
        {...props}
    >
        <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg' />
        <div className='px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent'>
            {props.title || 'Lit up borders'}
        </div>
    </Button>
);

export const BorderMagicButton = (props) => (
    <Button
        className='relative inline-flex h-12 overflow-hidden rounded-full p-[1px]'
        title={props.title || 'Border Magic'}
        {...props}
    >
        <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
        <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
            {props.title || 'Border Magic'}
        </span>
    </Button>
);

export const BrutalButton = (props) => (
    <Button
        className='px-8 py-0.5 border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]'
        title={props.title || 'Brutal'}
        {...props}
    >
        {props.title || 'Brutal'}
    </Button>
);

export const FavouriteButton = (props) => (
    <Button
        className='px-8 py-2 bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg'
        title={props.title || 'Favourite'}
        {...props}
    >
        {props.title || 'Favourite'}
    </Button>
);

export const OutlineButton = (props) => (
    <Button
        className='px-4 py-2 rounded-xl border border-neutral-600 text-black bg-white hover:bg-gray-100 transition duration-200'
        title={props.title || 'Outline'}
        {...props}
    >
        {props.title || 'Outline'}
    </Button>
);

export const ShimmerButton = (props) => (
    <Button
        className='inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'
        title={props.title || 'Shimmer'}
        {...props}
    >
        {props.title || 'Shimmer'}
    </Button>
);

export const NextJsBlueButton = (props) => (
    <Button
        className='shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear'
        title={props.title || 'Next.js Blue'}
        {...props}
    >
        {props.title || 'Next.js Blue'}
    </Button>
);

export const NextJsWhiteButton = (props) => (
    <Button
        className='shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] px-8 py-2 bg-[#fff] text-[#696969] rounded-md font-light transition duration-200 ease-linear'
        title={props.title || 'Next.js White'}
        {...props}
    >
        {props.title || 'Next.js White'}
    </Button>
);

export const SpotifyButton = (props) => (
    <Button
        className='bg-[#1DB954] text-white font-bold py-2 px-4 rounded-full hover:bg-[#1aa34a]'
        title={props.title || 'Spotify'}
        {...props}
    >
        {props.title || 'Spotify'}
    </Button>
);
