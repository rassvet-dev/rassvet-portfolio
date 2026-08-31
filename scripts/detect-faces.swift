import Foundation
import CoreImage
import ImageIO

struct DetectedFace: Codable {
    let confidence: Float
    let x: Double
    let y: Double
    let width: Double
    let height: Double
    let centerX: Double
    let centerY: Double
}

struct DetectionResult: Codable {
    let image: String
    let faces: [DetectedFace]
}

func rounded(_ value: Double) -> Double {
    (value * 10_000).rounded() / 10_000
}

func detectFaces(at path: String) throws -> DetectionResult {
    let url = URL(fileURLWithPath: path)
    guard let image = CIImage(contentsOf: url) else {
        throw NSError(domain: "FaceDetection", code: 1, userInfo: [
            NSLocalizedDescriptionKey: "Could not decode image: \(path)"
        ])
    }

    let context = CIContext(options: [.useSoftwareRenderer: true])
    guard let detector = CIDetector(
        ofType: CIDetectorTypeFace,
        context: context,
        options: [CIDetectorAccuracy: CIDetectorAccuracyHigh]
    ) else {
        throw NSError(domain: "FaceDetection", code: 2, userInfo: [
            NSLocalizedDescriptionKey: "Could not create Core Image face detector"
        ])
    }

    let extent = image.extent
    let features = detector.features(in: image).compactMap { $0 as? CIFaceFeature }
    let faces = features.map { feature in
        let box = feature.bounds
        return DetectedFace(
            confidence: 1,
            x: rounded((box.minX - extent.minX) / extent.width),
            y: rounded(1 - ((box.maxY - extent.minY) / extent.height)),
            width: rounded(box.width / extent.width),
            height: rounded(box.height / extent.height),
            centerX: rounded((box.midX - extent.minX) / extent.width),
            centerY: rounded(1 - ((box.midY - extent.minY) / extent.height))
        )
    }
    .sorted { ($0.width * $0.height) > ($1.width * $1.height) }

    return DetectionResult(image: url.lastPathComponent, faces: faces)
}

let paths = Array(CommandLine.arguments.dropFirst())
guard !paths.isEmpty else {
    FileHandle.standardError.write(Data("Usage: swift scripts/detect-faces.swift <image> [...]\n".utf8))
    exit(64)
}

do {
    let results = try paths.map(detectFaces)
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
    let data = try encoder.encode(results)
    FileHandle.standardOutput.write(data)
    FileHandle.standardOutput.write(Data("\n".utf8))
} catch {
    FileHandle.standardError.write(Data("Face detection failed: \(error.localizedDescription)\n".utf8))
    exit(1)
}
