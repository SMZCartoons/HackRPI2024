from django.core.management.base import BaseCommand

from park_smart_analytics.models import Lots


class Command(BaseCommand):
    help = "Clears all data from the Lots table"

    def handle(self, *args, **kwargs):
        # Confirm with the user before deleting the data
        confirm = input(
            "Are you sure you want to delete all Lots data? This action cannot be undone (y/n): "
        )
        if confirm.lower() != "y":
            self.stdout.write(self.style.WARNING("Data deletion aborted."))
            return

        # Delete all the records in the Lots model
        deleted_count, _ = Lots.objects.all().delete()

        # Provide feedback on how many records were deleted
        self.stdout.write(
            self.style.SUCCESS(f"{deleted_count} record(s) deleted from the Lots table")
        )
