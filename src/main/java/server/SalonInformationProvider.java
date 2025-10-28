package server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import provider.DataProvider;
import provider.DataProviderFactory;
import provider.wz.WZFiles;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public class SalonInformationProvider {
    private static final Logger log = LoggerFactory.getLogger(SalonInformationProvider.class);
    private static final Set<Integer> MALE_HAIR_PREFIX = Set.of(30, 33, 36);
    private static final Set<Integer> FEMALE_HAIR_PREFIX = Set.of(31, 32, 34, 37);
    private static final Set<Integer> MALE_FACE_PREFIX = Set.of(20);
    private static final Set<Integer> FEMALE_FACE_PREFIX = Set.of(21);
    private static final SalonInformationProvider instance = new SalonInformationProvider();

    public static SalonInformationProvider getInstance() {
        return instance;
    }

    protected DataProvider equipData;
    protected Map<Integer, List<Integer>> maleHairs = new HashMap<>();
    protected Map<Integer, List<Integer>> femaleHairs = new HashMap<>();
    protected Map<Integer, List<Integer>> maleFaces = new HashMap<>();
    protected Map<Integer, List<Integer>> femaleFaces = new HashMap<>();

    private SalonInformationProvider() {
        equipData = DataProviderFactory.getDataProvider(WZFiles.CHARACTER);
        loadHairs();
        loadFaces();
    }

    public boolean isMaleHair(int hairId) {
        return MALE_HAIR_PREFIX.contains(hairId / 1000);
    }

    public boolean isFemaleHair(int hairId) {
        return FEMALE_HAIR_PREFIX.contains(hairId / 1000);
    }

    public int getHairSeries(int hairId) {
        // Gender: "30"000 -> 30, "31"000 -> 31
        // Type: 30"00"0 -> 00, 31"00"0 -> 00
        // Color: 3000"0" -> 0, 3100"0" -> 0
        // Series: Gender + Type
        return hairId / 10;
    }

    public int getHairColor(int hairId) {
        return hairId % 10;
    }

    public List<Integer> getHairTypes(int hairId) {
        int color = getHairColor(hairId);
        List<List<Integer>> hairTypes;
        if (isMaleHair(hairId)) {
            hairTypes = new ArrayList<>(maleHairs.values());
        } else if (isFemaleHair(hairId)) {
            hairTypes = new ArrayList<>(femaleHairs.values());
        } else {
            return List.of();
        }
        return hairTypes.stream()
                .map(hairList -> hairList.stream()
                .filter(id -> getHairColor(id) == color).findFirst().orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }

    public List<Integer> getHairColors(int hairId) {
        int series = getHairSeries(hairId);
        if (isMaleHair(hairId)) {
            return maleHairs.get(series);
        } else if (isFemaleHair(hairId)) {
            return femaleHairs.get(series);
        }
        return List.of();
    }

    private void loadHairs() {
        List<Integer> hairs = new ArrayList<>();
        equipData.getRoot().getSubdirectories().stream()
            .filter(dir -> dir.getName().startsWith("Hair"))
            .forEach(hairDir -> {
                hairDir.getFiles().stream()
                        .map(file -> Integer.parseInt(file.getName().replace(".img", "")))
                        .sorted(Comparator.naturalOrder())
                        .forEach(hairs::add);
            });
        Map<Integer, List<Integer>> groupedHairs = new HashMap<>();
        // Group hairs by their series
        for (int hairId : hairs) {
            int series = getHairSeries(hairId);
            groupedHairs.computeIfAbsent(series, k -> new ArrayList<>()).add(hairId);
        }
        groupedHairs.forEach((series, hairList) -> {
            if (!hairList.isEmpty()) {
                int firstHairId = hairList.getFirst();
                if (isMaleHair(firstHairId)) {
                    maleHairs.put(series, hairList);
                } else if (isFemaleHair(firstHairId)) {
                    femaleHairs.put(series, hairList);
                }
            }
        });
        log.info("Loaded {} hair style for the salon.", hairs.size());
    }

    public boolean isMaleFace(int faceId) {
        return MALE_FACE_PREFIX.contains(faceId / 1000);
    }

    public boolean isFemaleFace(int faceId) {
        return FEMALE_FACE_PREFIX.contains(faceId / 1000);
    }

    public int getFaceSeries(int faceId) {
        // Gender: "20"000 -> 20, "21"000 -> 21
        // Color: 20"0"00 -> 0, 21"0"00 -> 0
        // Type: 200"00" -> 00, 210"00" -> 00
        // Series: Gender + Type
        return Integer.parseInt((faceId / 1000) + "" + (faceId % 100));
    }

    public int getFaceColor(int faceId) {
        return (faceId / 100) % 10;
    }

    public List<Integer> getFaceTypes(int faceId) {
        int color = getFaceColor(faceId);
        List<List<Integer>> faceTypes;
        if (isMaleFace(faceId)) {
            faceTypes = new ArrayList<>(maleFaces.values());
        } else if (isFemaleFace(faceId)) {
            faceTypes = new ArrayList<>(femaleFaces.values());
        } else {
            return List.of();
        }
        return faceTypes.stream()
                .map(faceList -> faceList.stream()
                .filter(id -> getFaceColor(id) == color).findFirst().orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }

    public List<Integer> getFaceColors(int faceId) {
        int series = getFaceSeries(faceId);
        if (isMaleFace(faceId)) {
            return maleFaces.get(series);
        } else if (isFemaleFace(faceId)) {
            return femaleFaces.get(series);
        }
        return List.of();
    }

    private void loadFaces() {
        List<Integer> faces = new ArrayList<>();
        equipData.getRoot().getSubdirectories().stream()
                .filter(dir -> dir.getName().startsWith("Face"))
                .forEach(faceDir -> {
                    faceDir.getFiles().stream()
                            .map(file -> Integer.parseInt(file.getName().replace(".img", "")))
                            .sorted(Comparator.naturalOrder())
                            .forEach(faces::add);
                });
        Map<Integer, List<Integer>> groupedFaces = new HashMap<>();
        // Group faces by their series
        for (int faceId : faces) {
            int series = getFaceSeries(faceId);
            groupedFaces.computeIfAbsent(series, k -> new ArrayList<>()).add(faceId);
        }
        groupedFaces.forEach((series, faceList) -> {
            if (!faceList.isEmpty()) {
                int firstFaceId = faceList.getFirst();
                if (isMaleFace(firstFaceId)) {
                    maleFaces.put(series, faceList);
                } else if (isFemaleFace(firstFaceId)) {
                    femaleFaces.put(series, faceList);
                }
            }
        });
        log.info("Loaded {} face style for the salon.", faces.size());
    }
}
