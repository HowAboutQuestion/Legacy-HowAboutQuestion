import { MediumTitle, LargeTitle, SmallContent, Code, TOOLTIP, withTooltip } from "pages/tour/tourUi.js"

export default function getDashboardSteps() {
    return [
        {
            target: 'body',
            title: (
                <div>
                    <p style={{ color: '#1D4ED8', fontSize: '20px', fontWeight: 'bold' }}>
                        대시보드 페이지에 오신걸 환영합니다
                    </p>
                </div>
            ),
            content: (
                <div>
                    <SmallContent>
                        이곳에서는 사용자의 학습 데이터를 기반으로 오늘의 추천 문제를 제공합니다.
                    </SmallContent>
                    <SmallContent>
                        또한, <strong>푼 문제 수, 맞춘 문제 수, 정답률</strong>을 한눈에 확인하고, 과거 기록을 손쉽게 조회할 수 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '[data-tour-id="dashboard-recommendation"]',
            content: (
                <div>
                    <MediumTitle>오늘의 추천 문제</MediumTitle>
                    <SmallContent>
                        “오늘의 추천 문제”를 통해 자주 틀리거나 새로 생성된 문제를 <strong>복습</strong>하세요!
                    </SmallContent>
                    <SmallContent>
                        학습한 문제는 <strong>자주 맞출수록 덜 등장</strong>하고, <strong>자주 틀릴수록 더 자주 추천</strong>됩니다.
                    </SmallContent>
                </div>
            ),
            placement: "bottom",
            disableBeacon: true
        },
        {
            target: '[data-tour-id="dashboard-stats"]',
            content: (
                <div>
                    <MediumTitle>오늘의 학습 진도율 안내</MediumTitle>
                    <SmallContent>오늘 푼 문제 수와 맞춘 문제 개수를 확인할 수 있습니다.</SmallContent>
                    <SmallContent>
                        학습 진도는 <strong>추천 문제 중 푼 개수</strong>에 따라 달라집니다.
                    </SmallContent>
                </div>
            ),
            placement: "top",
            disableBeacon: true
        },
        {
            target: '[data-tour-id="dashboard-graph"]',
            content: (
                <div>
                    <MediumTitle>나의 정답률 그래프</MediumTitle>
                    <SmallContent>
                        지금까지의 <strong>정답률 변화</strong>를 한눈에 확인할 수 있습니다.
                    </SmallContent>
                    <SmallContent>
                        그래프를 통해 <strong>어제보다 발전하는 나</strong>를 만나보세요!
                    </SmallContent>
                </div>
            ),
            placement: "bottom",
            disableBeacon: true
        },
        {
            target: '[data-tour-id="dashboard-history"]',
            content: (
                <div>
                    <MediumTitle>학습 기록 & 히스토리</MediumTitle>
                    <SmallContent>
                        히스토리에서 <strong>최근 7개</strong>(일일 기준)의 <strong>학습 추이</strong>(푼 문제, 맞춘 문제, 정답률)를 확인할 수 있어요
                    </SmallContent>
                    <SmallContent>
                        더 오래된 기록은 <strong>달력 보기</strong>를 통해 특정 날짜별로 확인할 수 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: "top",
            disableBeacon: true
        },
        {
            target: '[data-tour-id="dashboard-switch"]',
            content: (
                <div>
                    <MediumTitle>달력 리스트 전환하기</MediumTitle>
                    <SmallContent>
                        <strong>달력 ↔ 리스트</strong>는 이 버튼을 통해 전환이 가능해요!
                    </SmallContent>
                </div>
            ),
            placement: "left",
            disableBeacon: true,
            styles: TOOLTIP.ssm,
        },
    ];
}