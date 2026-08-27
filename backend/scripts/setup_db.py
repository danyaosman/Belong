from scripts.create_tables import main as create_tables
from scripts.seed_characters import main as seed_characters
from scripts.seed_lessons import main as seed_lessons


def main():
    print("\n==============================")
    print("1. Creating database tables")
    print("==============================")

    create_tables()

    print("\n==============================")
    print("2. Seeding characters")
    print("==============================")

    seed_characters()

    print("\n==============================")
    print("3. Seeding lessons")
    print("==============================")

    seed_lessons()

    print("\n==============================")
    print("Database setup complete!")
    print("==============================")


if __name__ == "__main__":
    main()