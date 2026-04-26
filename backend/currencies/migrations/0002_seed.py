from django.db import migrations


def seed_currencies(apps, schema_editor):
    Currency = apps.get_model("currencies", "Currency")
    Currency.objects.bulk_create([
        Currency(code="XAF", name="CFA Franc BEAC", symbol="FCFA", rate=1,       is_active=True, is_default=True),
        Currency(code="USD", name="US Dollar",       symbol="$",    rate=0.00165, is_active=True, is_default=False),
        Currency(code="EUR", name="Euro",             symbol="€",    rate=0.00152, is_active=True, is_default=False),
    ])


class Migration(migrations.Migration):
    dependencies = [("currencies", "0001_initial")]
    operations = [migrations.RunPython(seed_currencies, migrations.RunPython.noop)]
