import Link from "next/link";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  createRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import { Context } from "../interfaces/context";
import Popper, { ReferenceObject } from "popper.js";
import { getUserbyId } from "../services/user.service";
import { UserDetail } from "../interfaces/user";
import { showImageClient } from "../services/client.service";

interface Props {
  color: string;
  reload?: boolean | undefined;
  setReload?: Dispatch<SetStateAction<boolean>> | undefined;
}

const Dropdown = ({ color, reload, setReload }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const [user, setUser] = useState<UserDetail>();
  const btnDropdownRef = createRef<Element | ReferenceObject | any>();
  const popoverDropdownRef = createRef<Element | ReferenceObject | any>();
  const context: Context = useAuth();
  const { auth } = context;
  const loggout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
    closeDropdownPopover();
    context.handleLoggout();
  };
  const getUserInfo = () => {
    auth &&
      getUserbyId(auth.clienteid).then((res) => {
        setUser(res.cliente);
      });
  };
  const openDropdownPopover = () => {
    new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", closeDropdownPopover);
    }
    watchScroll();
    return () => {
      window.removeEventListener("scroll", closeDropdownPopover);
    };
  }),
    [];
  useEffect(() => {
    getUserInfo();
    return;
  }, [context]);
  // bg colors
  let bgColor;
  color === "white"
    ? (bgColor = "bg-gray-800")
    : (bgColor = "bg-" + color + "-500");
  React.useEffect(() => {
    setReload && setReload(false);
    return;
  }, [reload]);
  return (
    <>
      <div className="flex flex-wrap pb-2">
        <div className="w-full">
          <nav
            style={{ zIndex: 40 }}
            className="flex w-full flex-wrap items-center justify-between px-2 sm:py-3 navbar-expand-lg bg-indigo-500 fixed"
          >
            <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
                <Link href="/">
                  <span className="text-sm font-bold leading-relaxed cursor-pointer inline-block mr-4 py-2 whitespace-no-wrap uppercase text-white">
                    System PC
                  </span>
                </Link>
                <button
                  className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                  type="button"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    closeDropdownPopover();
                  }}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
              </div>
              <div
                className={
                  "lg:flex flex-grow items-center" +
                  (menuOpen ? " flex" : " hidden")
                }
                id="example-navbar-info"
              >
                <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                  <li className="nav-item">
                    <Link href="/">
                      <span className="px-3 cursor-pointer py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
                        Inicio
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/catalog">
                      <span className="px-3 cursor-pointer py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
                        Catalogo
                      </span>
                    </Link>
                  </li>
                  {context.auth ? (
                    <>
                      <li className="nav-item">
                        <span
                          style={{ transition: "all .15s ease" }}
                          ref={btnDropdownRef}
                          onClick={() => {
                            dropdownPopoverShow
                              ? closeDropdownPopover()
                              : openDropdownPopover();
                          }}
                          className="px-3 py-2 cursor-pointer flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                        >
                          {context.auth.email}
                        </span>
                      </li>
                    </>
                  ) : (
                    <li className="nav-item">
                      <Link href="/auth">
                        <span className="px-3 py-2 cursor-pointer flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
                          Iniciar Sesion
                        </span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          (color === "white" ? "bg-white " : bgColor + " ") +
          "text-base lg:left-0 dpdown float-left py-2 list-none text-left rounded shadow-lg mt-8"
        }
        style={{ minWidth: "12rem" }}
      >
        <div
          className="inline-block h-32 w-32 ml-8 rounded-full ring-2 ring-white bg-green-500"
          style={{
            backgroundImage: `url(${user && showImageClient(user.imagen)})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>
        <Link href="/orders">
          <p
            className={
              "text-sm py-2 px-4 font-normal cursor-pointer block w-full whitespace-no-wrap bg-transparent " +
              (color === "white" ? " text-gray-800" : "text-white")
            }
          >
            {" "}
            Mis compras
          </p>
        </Link>
        <Link href="/user">
          <p
            className={
              "text-sm py-2 cursor-pointer px-4 font-normal block w-full whitespace-no-wrap bg-transparent " +
              (color === "white" ? " text-gray-800" : "text-white")
            }
          >
            Mi cuenta
          </p>
        </Link>
        <div className="h-0 my-2 border border-solid border-t-0 border-gray-900 opacity-25" />
        <span
          className={
            "text-sm py-2 px-4 font-normal cursor-pointer block w-full whitespace-no-wrap bg-transparent " +
            (color === "white" ? " text-gray-800" : "text-white")
          }
          onClick={loggout}
        >
          Cerrar Sesion
        </span>
      </div>
    </>
  );
};

interface NavProps {
  reload?: boolean | undefined;
  setReload?: Dispatch<SetStateAction<boolean>> | undefined;
}

export default function NavBar({ reload, setReload }: NavProps) {
  return (
    <>
      <Dropdown color="white" reload={reload} setReload={setReload} />
    </>
  );
}
