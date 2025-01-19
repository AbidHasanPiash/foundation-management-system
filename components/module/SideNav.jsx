'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { VscDebugBreakpointLogUnverified } from 'react-icons/vsc';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SideNav({ subNav }) {
    const pathname = usePathname();
    const isActive = (url) => pathname === url;

    // State to manage expanded/collapsed items
    const [expandedItems, setExpandedItems] = useState({});

    // Check if a menu or submenu contains an active link
    const isSubItemActive = (items) => {
        return items.some((item) => {
            if (item.href && isActive(item.href)) return true;
            if (item.subItems) return isSubItemActive(item.subItems); // Recursively check submenus
            return false;
        });
    };

    // Toggle the visibility of submenus
    const toggleExpand = (index) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [index]: !prevState[index], // Toggle the current item
        }));
    };

    // Animation variants for expand/collapse
    const variants = {
        collapsed: { height: 0, opacity: 0, overflow: 'hidden' },
        expanded: { height: 'auto', opacity: 1 },
    };

    // Recursive function to render menu and submenus with expand/collapse logic
    const renderMenuItems = (items, parentIndex = null) => {
        return (
            <ul className='ml-2'>
                {items.map((item, index) => {
                    const currentIndex =
                        parentIndex !== null
                            ? `${parentIndex}-${index}`
                            : index;

                    // Expand if the sub-item is active
                    useEffect(() => {
                        if (item.subItems && isSubItemActive(item.subItems)) {
                            setExpandedItems((prevState) => ({
                                ...prevState,
                                [currentIndex]: true,
                            }));
                        }
                    }, [item.subItems, currentIndex]);

                    return (
                        <li key={currentIndex}>
                            {/* Check if the item has subItems */}
                            {item.href ? (
                                // If the item has a href, render it as a link
                                <Link
                                    href={item.href}
                                    className={`w-full p-1 md:p-2 pr-4 flex items-center md:border-l-2 space-x-2 ${isActive(item.href) ? 'border-blue-600 text-blue-600 font-bold' : ''}`}
                                >
                                    <VscDebugBreakpointLogUnverified />
                                    <span>{item.title}</span>
                                </Link>
                            ) : (
                                // If the item has no href, render it as a clickable element for expanding/collapsing
                                <div
                                    onClick={() => toggleExpand(currentIndex)}
                                    className='cursor-pointer w-full p-1 md:p-2 pr-4 flex items-center md:border-l-2 space-x-2'
                                >
                                    <VscDebugBreakpointLogUnverified />
                                    <span>{item.title}</span>
                                </div>
                            )}

                            {/* Render subitems if present and item is expanded, with animation */}
                            {item.subItems && (
                                <motion.div
                                    initial='collapsed'
                                    animate={
                                        expandedItems[currentIndex]
                                            ? 'expanded'
                                            : 'collapsed'
                                    }
                                    variants={variants}
                                    transition={{ duration: 0.3 }}
                                    className='ml-4'
                                >
                                    {renderMenuItems(
                                        item.subItems,
                                        currentIndex
                                    )}
                                </motion.div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <nav className='w-full md:max-w-60 lg:max-w-72'>
            <Card className='overflow-hidden p-4'>
                <h1 className='text-base sm:text-lg md:text-xl xl:text-2xl font-bold'>
                    {subNav?.title}
                </h1>
                {subNav?.subItems && renderMenuItems(subNav.subItems)}
            </Card>
        </nav>
    );
}
