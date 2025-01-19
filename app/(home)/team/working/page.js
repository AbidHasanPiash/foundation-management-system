import MemberListCard from '@/components/card/MemberListCard';
import PaginationController from '@/components/common/PaginationController';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

// Simulated "Database" of members
const allMembers = {
    data: [
        {
            id: 1,
            code: 'F00264',
            name: 'Prof. Dr. Engr. Mohammad Shamsul Arefin',
            designation: 'President',
            email: 'sarefin_406@yahoo.com',
            organization: 'Professor, Department of CSE, CUET',
            img: 'https://github.com/shadcn.png',
        },
        {
            id: 2,
            code: 'F00265',
            name: 'Dr. Jane Doe',
            designation: 'Vice President',
            email: 'jane.doe@example.com',
            organization: 'Associate Professor, Department of EEE, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 3,
            code: 'F00266',
            name: 'Mr. John Smith',
            designation: 'Secretary',
            email: 'john.smith@example.com',
            organization:
                'Lecturer, Department of Mechanical Engineering, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 4,
            code: 'F00267',
            name: 'Ms. Sarah Khan',
            designation: 'Treasurer',
            email: 'sarah.khan@example.com',
            organization: 'Lecturer, Department of Civil Engineering, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 5,
            code: 'F00268',
            name: 'Mr. Richard Roe',
            designation: 'Member',
            email: 'richard.roe@example.com',
            organization: 'Assistant Professor, Department of CSE, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 6,
            code: 'F00269',
            name: 'Ms. Emily Clark',
            designation: 'Member',
            email: 'emily.clark@example.com',
            organization: 'Assistant Professor, Department of EEE, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 7,
            code: 'F00270',
            name: 'Mr. Ali Khan',
            designation: 'Member',
            email: 'ali.khan@example.com',
            organization: 'Professor, Department of Architecture, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 8,
            code: 'F00271',
            name: 'Ms. Ayesha Siddiqui',
            designation: 'Member',
            email: 'ayesha.siddiqui@example.com',
            organization: 'Lecturer, Department of Architecture, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 9,
            code: 'F00272',
            name: 'Mr. Ibrahim Ahmed',
            designation: 'Member',
            email: 'ibrahim.ahmed@example.com',
            organization:
                'Lecturer, Department of Electrical Engineering, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 10,
            code: 'F00273',
            name: 'Ms. Zara Khan',
            designation: 'Member',
            email: 'zara.khan@example.com',
            organization:
                'Assistant Professor, Department of Mechanical Engineering, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 11,
            code: 'F00274',
            name: 'Mr. Abdullah Rahman',
            designation: 'Member',
            email: 'abdullah.rahman@example.com',
            organization: 'Lecturer, Department of Civil Engineering, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 12,
            code: 'F00275',
            name: 'Ms. Fatima Begum',
            designation: 'Member',
            email: 'fatima.begum@example.com',
            organization: 'Assistant Professor, Department of CSE, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 13,
            code: 'F00276',
            name: 'Mr. David Lee',
            designation: 'Member',
            email: 'david.lee@example.com',
            organization:
                'Lecturer, Department of Electrical Engineering, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 14,
            code: 'F00277',
            name: 'Ms. Anika Rahman',
            designation: 'Member',
            email: 'anika.rahman@example.com',
            organization:
                'Lecturer, Department of Mechanical Engineering, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 15,
            code: 'F00278',
            name: 'Mr. Hassan Uddin',
            designation: 'Member',
            email: 'hassan.uddin@example.com',
            organization: 'Professor, Department of Architecture, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 16,
            code: 'F00279',
            name: 'Ms. Sofia Islam',
            designation: 'Member',
            email: 'sofia.islam@example.com',
            organization:
                'Assistant Professor, Department of Civil Engineering, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 17,
            code: 'F00280',
            name: 'Mr. Michael James',
            designation: 'Member',
            email: 'michael.james@example.com',
            organization: 'Professor, Department of Architecture, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 18,
            code: 'F00281',
            name: 'Ms. Laila Noor',
            designation: 'Member',
            email: 'laila.noor@example.com',
            organization: 'Lecturer, Department of CSE, CUET',
            img: 'https://example.com/laila.jpg',
        },
        {
            id: 19,
            code: 'F00282',
            name: 'Mr. Jamal Ahmed',
            designation: 'Member',
            email: 'jamal.ahmed@example.com',
            organization:
                'Assistant Professor, Department of Electrical Engineering, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 20,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 21,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 22,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 23,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 24,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 25,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 26,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 27,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 28,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 29,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 30,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 31,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 32,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 33,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 34,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 35,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 36,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 37,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 38,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 39,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
        {
            id: 40,
            code: 'F00283',
            name: 'Ms. Maya Patel',
            designation: 'Member',
            email: 'maya.patel@example.com',
            organization: 'Assistant Professor, Department of ME, CUET',
            img: 'https://example.com/shadcn.jpg',
        },
    ],
    total: 40,
};

async function getData(page = 1, pageSize = 10) {
    // Simulating an API call by slicing the allMembers data
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedMembers = allMembers.data.slice(start, end);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: paginatedMembers, total: allMembers.data.length });
        }, 1000); // Simulate a delay
    });
}

export default async function ExecutiveCommittee({ searchParams }) {
    // const currentPage = Number(searchParams['page'] ?? '1');
    // const itemsPerPage = Number(searchParams['items'] ?? '2');

    // const { data: members, total } = await getData(currentPage, itemsPerPage);
    // const totalPages = Math.ceil(total / itemsPerPage);

    const data = await fetchDataAsServer(apiConfig?.GET_TEAM_LIST);

    return (
        <div className="w-full">
            <Accordion
                type="multiple"
                collapsible
                defaultValue={['item-1']}
                className="space-y-2"
            >
                <AccordionItem value="item-1">
                    <AccordionTrigger>Dhaka section</AccordionTrigger>
                    <AccordionContent className="space-y-4 lg:space-y-6">
                        {data &&
                            data?.map((member) => (
                                <MemberListCard
                                    key={member?.id}
                                    member={member}
                                />
                            ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Chattagram section</AccordionTrigger>
                    <AccordionContent className="space-y-4 lg:space-y-6">
                        {data &&
                            data?.map((member) => (
                                <MemberListCard
                                    key={member?.id}
                                    member={member}
                                />
                            ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Pagination */}
            {/* <PaginationController
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
            /> */}
        </div>
    );
}
