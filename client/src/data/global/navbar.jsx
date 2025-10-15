import { FiHome } from "react-icons/fi"; 
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { GiPalmTree } from "react-icons/gi";
import { FaRegHandshake } from "react-icons/fa";

export const NavbarMenu = [
    {
        id: 1,
        key: "home",
        title: "Home",
        link: "/",
        icon: <FiHome />,
    },
    {
        id: 2,
        key: "attendance",
        title: "Attendance",
        link: "/attendance",
        icon: <HiMiniCalendarDateRange />,
    },
    {
        id: 3,
        key: "leaves",
        title: "Leaves",
        link: "/leaves",
        icon: <GiPalmTree />,
    },
    {
        id: 4,
        key: "policies",
        title: "Policies",
        link: "/policies",
        icon: <FaRegHandshake />,
    }
];
