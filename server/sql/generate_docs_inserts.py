import os
import glob

def escape_sql(s):
    return s.replace("'", "''")

text_dir = os.path.join(os.path.dirname(__file__), "../storage/texts")
output_sql = []

for filepath in sorted(glob.glob(os.path.join(text_dir, "*.txt"))):
    filename = os.path.basename(filepath)
    doc_id = os.path.splitext(filename)[0]
    try:
        doc_id_int = int(doc_id)
    except ValueError:
        continue  # skip files that don't start with a number
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    doc_name = f"학사제도 Pg. {doc_id}"
    doc_content = escape_sql(content)
    sql = (
        f"INSERT INTO docs (doc_id, doc_name, doc_content, doc_thumbnail) "
        f"VALUES ({doc_id_int}, '{doc_name}', '{doc_content}', NULL);"
    )
    output_sql.append(sql)

with open(os.path.join(os.path.dirname(__file__), "migrate_texts_to_docs.sql"), "w", encoding="utf-8") as out:
    out.write("-- Generated SQL for migrating text files to docs table\n")
    for line in output_sql:
        out.write(line + "\n")

print("SQL migration script generated at sql/migrate_texts_to_docs.sql")
