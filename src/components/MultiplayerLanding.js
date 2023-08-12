import React from "react"
import { useNavigate } from "react-router-dom"

const MultiplayerLanding = () => {
    const navigate = useNavigate();
    const navBot = () => {
        navigate('/BotPlayLanding');
    }
    const navLogin = () => {
        navigate('/');
    }
    return (
        <>
            <div
                className="bg-body shadow d-flex flex-column flex-shrink-0 position-fixed top-0 bottom-0"
                style={{ width: "4.5rem" }}
            >
                <a
                    onClick={navLogin}
                    className="text-center link-body-emphasis d-block p-3 text-decoration-none border-bottom"
                    href="#"
                    title=""
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    data-bs-original-title="Icon-only"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-32 0 512 512"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        style={{ fontSize: 25 }}
                    >
                        {/*! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. */}
                        <path d="M391.9 464H55.95c-13.25 0-23.1 10.75-23.1 23.1S42.7 512 55.95 512h335.1c13.25 0 23.1-10.75 23.1-23.1S405.2 464 391.9 464zM448 216c0-11.82-3.783-23.51-11.08-33.17c-10.3-14.39-27-22.88-44.73-22.88L247.9 160V104h31.1c13.2 0 24.06-10.8 24.06-24S293.1 56 279.9 56h-31.1V23.1C247.9 10.8 237.2 0 223.1 0S199.9 10.8 199.9 23.1V56H167.9c-13.2 0-23.97 10.8-23.97 24S154.7 104 167.9 104h31.1V160H55.95C24.72 160 0 185.3 0 215.9C0 221.6 .8893 227.4 2.704 233L68.45 432h50.5L48.33 218.4C48.09 217.6 47.98 216.9 47.98 216.1C47.98 212.3 50.93 208 55.95 208h335.9c6.076 0 8.115 5.494 8.115 8.113c0 .6341-.078 1.269-.2405 1.887L328.8 432h50.62l65.1-199.2C447.2 227.3 448 221.7 448 216z"></path>
                    </svg>
                    <span className="visually-hidden">Icon-only</span>
                </a>
                <ul className="nav nav-pills flex-column text-center nav-flush mb-auto">
                    <li className="nav-item">
                        <a
                            onClick={navBot}
                            className="nav-link link-light py-3 border-bottom rounded-0"
                            href="#"
                            aria-current="page"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 20 20"
                                fill="none"
                                style={{ color: "rgb(12,110,253)" }}
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3 5C3 3.89543 3.89543 3 5 3H15C16.1046 3 17 3.89543 17 5V13C17 14.1046 16.1046 15 15 15H12.7808L12.903 15.4887L13.7071 16.2929C13.9931 16.5789 14.0787 17.009 13.9239 17.3827C13.7691 17.7563 13.4045 18 13 18H7.00003C6.59557 18 6.23093 17.7563 6.07615 17.3827C5.92137 17.009 6.00692 16.5789 6.29292 16.2929L7.09706 15.4887L7.21925 15H5C3.89543 15 3 14.1046 3 13V5ZM8.7713 12C8.75657 11.9997 8.74189 11.9997 8.72725 12H5V5H15V12H11.2728C11.2582 11.9997 11.2435 11.9997 11.2288 12H8.7713Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active py-3 border-bottom rounded-0" href="#">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                className="bi bi-people"
                            >
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"></path>
                            </svg>
                        </a>
                    </li>
                </ul>
                <div className="dropdown p-3 border-top">
                    <a
                        className="dropdown-toggle link-body-emphasis d-flex align-items-center text-decoration-none"
                        aria-expanded="false"
                        data-bs-toggle="dropdown"
                        role="button"
                    >
                        <img
                            className="rounded-circle"
                            alt=""
                            width={32}
                            height={32}
                            src="https://cdn.bootstrapstudio.io/placeholders/1400x800.png"
                            style={{ objectFit: "cover" }}
                        />
                    </a>
                    <div
                        className="dropdown-menu shadow text-small"
                        data-popper-placement="top-start"
                    >
                        <a className="dropdown-item" href="#">
                            New project...
                        </a>
                        <a className="dropdown-item" href="#">
                            Settings
                        </a>
                        <a className="dropdown-item" href="#">
                            Profile
                        </a>
                        <div className="dropdown-divider" />
                        <a className="dropdown-item" href="#">
                            Sign out
                        </a>
                    </div>
                </div>
            </div>
            <div
                className="container"
                style={{ backdropFilter: "blur(0px) grayscale(0%)" }}
            >
                <div className="row mb-5" style={{ marginTop: "100px" }}>
                    <div className="col-md-8 col-xl-6 text-center mx-auto">
                        <h2>Play online</h2>
                        <p className="w-lg-50">
                            Either create a new game, or join an existing game
                        </p>
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-xl-4">
                        <div className="card mb-5">
                            <div className="card-body d-flex flex-column align-items-center">
                                <form className="text-center" method="post">
                                    <div className="mb-3">
                                        <button
                                            className="btn btn-primary d-block w-100"
                                            type="button"
                                        >
                                            Create game
                                        </button>
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Game ID"
                                            inputMode="url"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <button
                                            className="btn btn-primary d-block w-100"
                                            type="button"
                                        >
                                            Join existing game
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MultiplayerLanding;