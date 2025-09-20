import cv2
import time
import datetime

video_path = "public/car_demo.mp4"
cap = cv2.VideoCapture(video_path)

fgbg = cv2.createBackgroundSubtractorMOG2(history=500, varThreshold=50, detectShadows=False)

slot_region = (110, 70, 400, 300)
motion_threshold = 5000
stable_frames_to_mark_in = 15

status = "OUT"
motion_counter = 0
stop_counter = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    x, y, w, h = slot_region
    slot_frame = frame[y:y+h, x:x+w]

    fgmask = fgbg.apply(slot_frame)
    fgmask = cv2.GaussianBlur(fgmask, (5,5), 0)
    motion_count = cv2.countNonZero(fgmask)

    # --- Car entering and stopping ---
    if status == "OUT":
        if motion_count > motion_threshold:
            motion_counter += 1
            stop_counter = 0
        else:
            if motion_counter > 0:
                stop_counter += 1
            if stop_counter >= stable_frames_to_mark_in:
                status = "IN"
                motion_counter = 0
                stop_counter = 0
                print(f"{datetime.datetime.now()} → Car Entered → Status IN")

    # --- Car leaving ---
    elif status == "IN":
        if motion_count > motion_threshold:
            # Motion detected → car starts leaving
            status = "OUT"
            motion_counter = 0
            stop_counter = 0
            print(f"{datetime.datetime.now()} → Car Left → Status OUT")

    # Visualization
    cv2.rectangle(frame, (x, y), (x+w, y+h), (0,255,0), 2)
    cv2.putText(frame, f"Slot: {status}", (x, y-10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)

    cv2.imshow("Parking Slot Detection", frame)
    if cv2.waitKey(30) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
