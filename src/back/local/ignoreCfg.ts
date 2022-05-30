import { Cfg_sqlend } from "../../jscore/db/connection";

export default function main() {
    (global as any).cfg_sqlend = new Cfg_sqlend;
    let cfg_sql: Cfg_sqlend = (global as any).cfg_sqlend;

    cfg_sql.server = '178.154.253.113';
    cfg_sql.port = 23366;
    cfg_sql.password = 'crtwbpass';
    cfg_sql.db = 'geograph';
}
