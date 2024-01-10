export default function Header() {

    return(
        <>
            <nav className="navbar navbar-expand-lg navbarbar-light bg-light">
                <a className="navbar-brand" href="#">Logo</a>
                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="#" className="nav-link">Register</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">Login</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}