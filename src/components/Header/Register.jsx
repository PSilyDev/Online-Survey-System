export default function Register() {
    return(
        <>
            <div className="container min-vh-100 d-flex justify-content-center align-items-center">
                <form>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" />
                    </div>
                </form>
            </div>
        </>
    );
}