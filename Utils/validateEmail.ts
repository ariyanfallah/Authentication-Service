/**
 * 
 * @param email 
 * @returns boolean
    *  Start with one or more word characters, hyphen, or dot.
        Followed by the @ symbol.
        Followed by one or more sequences of word characters or hyphen followed by a dot.
        End with between 2 and 4 word characters or hyphen. 
 */

import logger from "../Configs/logger";

const validateEmail = (email: string) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    try {
        logger.info("Validating email initiated...");
        if (!emailRegex.test(email)) {
            logger.warn("Invalid email");
            return false;
        }
        logger.info("Email validated successfully");
        return true;
    } catch (error) {
        logger.error(`Error validating email: ${error}`);
        return false;
    }
}

export {validateEmail};