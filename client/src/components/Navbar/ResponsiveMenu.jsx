import { motion, AnimatePresence } from "framer-motion";
import { NavbarMenu } from "../../data/global/navbar";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const ResponsiveMenu = ({ open, setOpen }) => {
  const Menu = [
    ...NavbarMenu,
    {
      id: 6,
      key: "loginBtn",
      title: "Login",
      link: "/login",
    },
  ];

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-16 left-0 w-full h-full z-20 bg-white dark:bg-gray-900 flex justify-center items-center transition-colors duration-300"
        >
          <div className="text-3xl font-semibold uppercase text-gray-900 dark:text-white py-10 m-6 rounded-3xl">
            <ul className="flex flex-col justify-center items-center gap-10">
              {Menu.map((item) => {
                return (
                  <li key={item.id}>
                    <Link to={item.link} onClick={() => setOpen(false)}>
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
