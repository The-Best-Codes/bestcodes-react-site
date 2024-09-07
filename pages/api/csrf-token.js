import { setup } from '@/lib/csrf';

const handler = async (req, res) => {
    return res.status(200).json({ message: "CSRF token generated" });
};

export const getServerSideProps = setup(handler);
export default setup(handler);
