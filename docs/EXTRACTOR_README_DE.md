# ArzSw.FHIR.Extractor

Eine .NET Standard 2.0 Bibliothek zum Extrahieren deutscher eRezept-Daten (elektronisches Rezept) aus FHIR-XML-Dateien.

## Funktionen

- **Plattformübergreifend**: Funktioniert mit .NET Framework 4.6.1+ und .NET Core 2.0+
- **Standardkonform**: Entspricht den deutschen KBV/ABDA FHIR-Spezifikationen
- **Typsicher**: Stark typisierte Modellklassen für alle eRezept-Daten
- **JSON-Unterstützung**: Integrierte JSON-Serialisierung für komplexe verschachtelte Objekte
- **Umfassend**: Extrahiert alle Verordnungsdaten einschließlich Abrechnung, Versicherung, Apotheke und Medikation

## Installation

### NuGet-Paket (sobald veröffentlicht)
```bash
Install-Package ArzSw.FHIR.Extractor
```

### Direkter DLL-Verweis
Fügen Sie Ihrem Projekt einen Verweis auf `ArzSw.FHIR.Extractor.dll` hinzu.

## Verwendung

### Einfaches Beispiel

```csharp
using ArzSw.FHIR.Extractor;
using ArzSw.FHIR.Extractor.Models;

// Extractor-Instanz erstellen
var extractor = new ERezeptAbgabeExtractor();

// Aus Datei extrahieren
var data = extractor.ExtractFromFile("path/to/erezept.xml");

// Auf extrahierte Daten zugreifen
Console.WriteLine($"Prescription ID: {data.PrescriptionId}");
Console.WriteLine($"Pharmacy: {data.Pharmacy.Name}");
Console.WriteLine($"Total: {data.Invoice.TotalGross} {data.Invoice.Currency}");
```

### Aus XML-Zeichenfolge extrahieren

```csharp
string xmlContent = File.ReadAllText("erezept.xml");
var data = extractor.ExtractFromXml(xmlContent);
```

### Aus XmlDocument extrahieren

```csharp
var xmlDoc = new XmlDocument();
xmlDoc.Load("erezept.xml");
var data = extractor.ExtractFromXmlDocument(xmlDoc);
```

## Struktur der extrahierten Daten

Die Klasse `ERezeptAbgabeData` enthält:

- **Apothekeninformationen**: Name, IK-Nummer, Adresse
- **Arztinformationen**: LANR, Name, Qualifikationen
- **Versicherungsinformationen**: Versicherungstyp, Kostenträger-IK
- **Medikationsabgabe**: Medikationsdetails, Dosierung
- **Rechnung**: Positionen, Preise, Zuzahlungen
- **Medikationsverordnung**: Mehrere Verordnungen, BVG-Kennzeichnung

### Beispielhafter Datenzugriff

```csharp
var data = extractor.ExtractFromFile("prescription.xml");

// Apotheke
Console.WriteLine($"Pharmacy: {data.Pharmacy.Name}");
Console.WriteLine($"IK: {data.Pharmacy.IK_Number}");
Console.WriteLine($"Address: {data.Pharmacy.Address.FormattedAddress}");

// Rechnung
foreach (var item in data.Invoice.LineItems)
{
    Console.WriteLine($"PZN: {item.PZN}, Amount: {item.Amount}");
}

// Versicherung
Console.WriteLine($"Insurance: {data.Coverage.PayorName}");
Console.WriteLine($"Payor IK: {data.Coverage.PayorIK}");

// Arzt
Console.WriteLine($"Doctor: {data.Practitioner.Name.FullName}");
Console.WriteLine($"LANR: {data.Practitioner.LANR}");
```

## Kompatibilität

### Unterstützte Plattformen

| Plattform | Version |
|----------|---------|
| .NET Framework | 4.6.1 oder höher |
| .NET Core | 2.0 oder höher |
| .NET | 5.0 oder höher |
| Mono | 5.4 oder höher |
| Xamarin.iOS | 10.14 oder höher |
| Xamarin.Android | 8.0 oder höher |

### Abhängigkeiten

- **Newtonsoft.Json** (13.0.3) - JSON-Serialisierung
- **System.ComponentModel.Annotations** (5.0.0) - Datenannotation

## FHIR-Spezifikationen

Diese Bibliothek implementiert die Extraktionslogik für:

- **KBV eRezept Abgabedaten** (Medication Dispense)
- **KBV eRezept Verordnung** (Medication Request)
- **DAV PKV Abgabedaten** (Invoice)
- **GKV-Erweiterungen** (Coverage, DMP)

## Modellklassen

Alle Modellklassen befinden sich im Namespace `ArzSw.FHIR.Extractor.Models`:

- `ERezeptAbgabeData` - Hauptcontainer
- `InvoiceInfo` - Rechnung mit Positionen
- `LineItemInfo` - Einzelne Verordnungspositionen
- `PharmacyInfo` - Apothekenorganisation
- `PractitionerInfo` - Arzt/Verordner
- `CoverageInfo` - Versicherungsschutz
- `MedicationDispenseInfo` - Abgegebene Medikation
- `MedicationRequestInfo` - Ursprüngliche Verordnung
- Und viele mehr...

## Fehlerbehandlung

Der Extractor wirft spezifische Ausnahmen:

```csharp
try
{
    var data = extractor.ExtractFromFile("prescription.xml");
}
catch (ArgumentException ex)
{
    // Dateipfad ist null oder leer
}
catch (FileNotFoundException ex)
{
    // Datei existiert nicht
}
catch (XmlException ex)
{
    // XML ist fehlerhaft
}
catch (InvalidOperationException ex)
{
    // Extraktion fehlgeschlagen
}
```

## Performance

Die Bibliothek verwendet:
- Effiziente XPath-Abfragen für die Datenextraktion
- Verzögerte JSON-Deserialisierung (nur beim Zugriff auf Eigenschaften)
- Minimale Allokationen für bessere Speichereffizienz

## Thread-Sicherheit

`ERezeptAbgabeExtractor`-Instanzen sind nach der Initialisierung für Leseoperationen threadsicher.

## Lizenz

Copyright © GfAL GmbH 2024

## Support

Bei Problemen, Fragen oder Beiträgen wenden Sie sich bitte an die GfAL GmbH.

## Versionshistorie

### 1.0.0
- Erstveröffentlichung
- Vollständige eRezept FHIR-XML-Extraktion
- .NET Standard 2.0 Unterstützung
- Umfassende Modellklassen
